export interface Entry {
    type: string
    valor: number
    date: string
}

export interface Venda extends Entry {
    ProductName: string;
    quantidade: number;
}

export interface Pagamento extends Entry {}
