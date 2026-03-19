export const maskCep = (value: string | undefined | null) => {
    if (!value) return '';
    return value
        .replace(/\D/g, '') 
        .replace(/^(\d{5})(\d)/, '$1-$2') 
        .slice(0, 9); 
};


export const maskPhone = (value: string | undefined | null) => {
    if (!value) return '';
    const numeric = value.replace(/\D/g, '');
    
    const truncated = numeric.slice(0, 11);

    return truncated
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
};
