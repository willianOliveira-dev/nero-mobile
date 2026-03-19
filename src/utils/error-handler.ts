import { AxiosError } from 'axios';

interface FastifyValidationError {
    keyword: string;
    instancePath: string;
    schemaPath: string;
    message: string;
    params: Record<string, any>;
}

interface FastifyErrorResponse {
    statusCode: number;
    code: string;
    error: string;
    message: string;
    validation?: FastifyValidationError[];
    validationContext?: string;
}

/**
 * Extrai a mensagem de erro mais legível possível de um erro de API
 * Focado em tratar erros de validação do Fastify/Zod (FST_ERR_VALIDATION)
 */
export function extractApiError(error: unknown, fallbackMessage = 'Ocorreu um erro inesperado.'): string {
    if (!error) return fallbackMessage;

    // Se for um erro do Axios com resposta do backend
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as FastifyErrorResponse;
        
        // Trata erro de validação específico (Fastify)
        if (data.code === 'FST_ERR_VALIDATION' && data.validation && data.validation.length > 0) {
            // Retorna a primeira mensagem de validação (ex: "CEP inválido.")
            const firstError = data.validation[0];
            return firstError.message || data.message;
        }

        // Outros erros tratados pela API que enviam uma mensagem
        if (data.message) {
            // O Fastify às vezes prefixa 'body/campo mensagem'. Limpar isso.
            if (data.message.includes('body/')) {
                return data.message.split('body/')[1].split(' ').slice(1).join(' ') || data.message;
            }
            return data.message;
        }
    }

    // Se for um Error padrão do JS
    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
}
