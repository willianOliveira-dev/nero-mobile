import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';


/**
 *  BUG FIX: Sessão Persistente / Troca de Contas
 * 
 * Por que precisamos disso?
 * O React Native no Android gerencia cookies nativamente via Java CookieManager.
 * Se deixarmos withCredentials: true, o axios intercepta o header 'set-cookie' 
 * do backend e salva no celular. Quando o usuário faz logout (signOut), nós limpamos 
 * o SecureStore, mas o cookie nativo do Java FICAVA PRESO, fazendo com que 
 * o próximo login puxasse a conta velha!
 * 
 * Solução:
 * 1. Desabilita o cookie nativo (withCredentials: false)
 * 2. Lê o cookie gerado pelo Better Auth manualmente do SecureStore (nero_cookie)
 * 3. Injeta ele "na mão" no header de todas as requisições
 */



export const AXIOS_INSTANCE = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});


function getBetterAuthCookie(): string {
    try {
        const raw = SecureStore.getItem('nero_cookie');
        if (!raw) return '';
        const parsed = JSON.parse(raw);
        return Object.entries(parsed)
            .reduce<string[]>((acc, [key, val]: [string, any]) => {
                if (val?.value) {
                    if (val.expires && new Date(val.expires) < new Date()) return acc;
                    acc.push(`${key}=${val.value}`);
                }
                return acc;
            }, [])
            .join('; ');
    } catch {
        return '';
    }
}

export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-ignore
    promise.cancel = () => {
        source.cancel('Requisição cancelada');
    };

    return promise;
};

AXIOS_INSTANCE.interceptors.request.use(
    async (config) => {
        const cookie = getBetterAuthCookie();
        if (cookie) {
            config.headers.set('cookie', cookie);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Acesso não autorizado - sessão expirada');
        }
        return Promise.reject(error);
    },
);
