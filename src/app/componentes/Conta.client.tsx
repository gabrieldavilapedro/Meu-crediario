'use client';
import React, { useEffect, useState } from 'react';
import IVenda from '../interfaces/IVenda';

function Conta({ id } : { id: string }) {
  const [vendas, setVendas] = useState<{[key:string]:IVenda}>({});
  const [ProductName, setProductName] = useState('');
  const [valor, setValor] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [valorTotal, setvalorTotal] = useState(0);
  const [idVenda, setIdVenda] = useState(0);

  useEffect(() => {
    if (id) {
      const clientes = JSON.parse(localStorage.getItem('clientes') || '{}');
      const cliente = clientes[id];
      if (cliente && cliente.vendas) {
        setVendas(cliente.vendas);
      }
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      ProductName: { value: string };
      valor: { value: number };
      quantidade: { value: number };
    };

    const valorTotal = valor * quantidade;
    setvalorTotal(valorTotal);
  }

  const handleConfirm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const dataDeVenda = new Date().toLocaleDateString();
    const idIncrement = idVenda + 1;
    setIdVenda(idIncrement);
    const newVenda = { ProductName, valor, quantidade, dataDeVenda ,valorTotal };
    setVendas({...vendas, [idIncrement]: newVenda});
  
    const clientes = JSON.parse(localStorage.getItem('clientes') || '{}');
  
    if (clientes[id]) {
      if (clientes[id].vendas) {
        clientes[id].vendas.push(newVenda);
      } else {
        clientes[id].vendas = [newVenda];
      }
    }
  
    localStorage.setItem('clientes', JSON.stringify(clientes));
  
    setProductName('');
    setValor(0);
    setQuantidade(0);
    setvalorTotal(0);
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
        <h2>Vendas</h2>
        <ul>
          {vendas && Object.keys(vendas).map((vendaId) => {
            const venda = vendas[vendaId];
            return (
              <li key={vendaId}>
                <p>Produto: {venda.ProductName}</p>
                <p>Valor: {venda.valor}</p>
                <p>Quantidade: {venda.quantidade}</p>
                <p>Data: {venda.dataDeVenda}</p>
                <p>Valor total: {venda.valorTotal}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Conta;