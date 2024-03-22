'use client';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Entry, Pagamento, Venda } from '../types/Entry';


function Conta({ id } : { id: string }) {
  const [entries, setEntries] = useState<{[key:string]:Entry}>({});
  const [ProductName, setProductName] = useState('');
  const [valor, setValor] = useState(0);
  const [valorPagamento, setValorPagamento] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [valorTotal, setvalorTotal] = useState(0);

  useEffect(() => {
      const clientes = JSON.parse(localStorage.getItem('clientes') || '{}');
      const cliente = clientes[id];
      if (cliente && cliente.entries) {
        setEntries(cliente.entries);
      }
  }, [id]);

  useEffect(() => {
    const clientes = JSON.parse(localStorage.getItem('clientes') || '{}');
  
    if (clientes[id]) {
      clientes[id].entries = entries;
    }
  
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [id,entries]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const valorTotal = valor * quantidade;
    setvalorTotal(valorTotal);
  }

  const handleConfirm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const date = new Date().toLocaleDateString();
    const id = uuidv4();
    const type = 'venda';
    const newEntry:Venda = { ProductName, valor, quantidade, date, type };
    setEntries({...entries, [id]: newEntry});
    setProductName('');
    setValor(0);
    setQuantidade(0);
    setvalorTotal(0);
  }

  const handlePagamento = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const date = new Date().toLocaleDateString();
    const id = uuidv4();
    const type = 'pagamento';
    const newPagamento: Pagamento = { valor: valorPagamento, date, type };
    setEntries({...entries, [id]: newPagamento});
    setValorPagamento(0);
  }

  return (
    <div>
      <div>
        <h1>Nova venda</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="ProductName">Nome do produto:</label>
            <input 
            type="text"
            id="ProductName" 
            name="ProductName" 
            onChange={(e) => setProductName(e.target.value)}
            value={ProductName}
            required/>
          </div>
              <div>
            <label htmlFor="valor">Valor</label>
            <input 
            type="number" 
            id="valor" 
            name="valor"
            onChange={(e) => setValor(parseFloat(e.target.value))}
            value={valor}
            required/>
          </div>
              <div>
                <div>
                  <label htmlFor="quantidade">Quantidade:</label>
                  <input 
                  type="number" 
                  id="quantidade" 
                  name="quantidade" 
                  onChange={(e) => setQuantidade(parseInt(e.target.value))}
                  value={quantidade}
                  required/>
              </div>
              <button>confirmar</button>
            </div>
        </form>
        <form onSubmit={handleConfirm}>
          <div>
            <h2>Resumo da venda</h2>
            <p>Produto: {ProductName}</p>
            <p>Quantidade: {quantidade}</p>
            <p>Valor total: {valorTotal}</p>
          </div>
          <button 
            type="submit"
            disabled={ProductName === '' || valorTotal === 0 || quantidade === 0}
          >Confirmar venda</button>
        </form>
      </div>
      <div>
        <h1>Novo pagamentos</h1>
        <form
          onSubmit={handlePagamento}
        >
          <div>
            <label htmlFor="valor">Valor</label>
            <input 
            type="number" 
            id="valor" 
            name="valor"
            onChange={(e) => setValorPagamento(parseFloat(e.target.value))}
            value={valorPagamento}
            required/>
          </div>
          <button>Confirmar pagamento</button>
        </form>
      </div>
      <div>
        <h2>extrato</h2>
        <ul>
          {Object.entries(entries).map(([id, entry]) => {
            if (entry.type === 'pagamento') {
              
              return (
                <li key={id}>
                  <p>Pagamento: {entry.valor}</p>
                  <p>Data: {entry.date}</p>
                </li>
              );
            }
            let venda = entry as Venda;
            return (
              <li key={id}>
                <p>Produto: {venda.ProductName}</p>
                <p>Valor: {venda.valor}</p>
                <p>Quantidade: {venda.quantidade}</p>
                <p>Data: {venda.date}</p>
                <p>Valor total: {venda.valor * venda.quantidade}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Conta;