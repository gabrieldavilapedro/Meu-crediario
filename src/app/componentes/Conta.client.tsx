'use client';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Entry, Pagamento, Venda } from '../types/Entry';
import Link from 'next/link';
import styles from '../styles/conta.styles.module.css'


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
  
    if (clientes[id] && Object.keys(entries).length > 0) {
      clientes[id].entries = entries;
      localStorage.setItem('clientes', JSON.stringify(clientes));
    }
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

  const handlePay = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const date = new Date().toLocaleDateString();
    const id = uuidv4();
    const type = 'pagamento';
    const newPagamento: Pagamento = { valor: valorPagamento, date, type };
    setEntries({...entries, [id]: newPagamento});
    setValorPagamento(0);
  }

  const deleteClient = () => {
    const clientes = JSON.parse(localStorage.getItem('clientes') || '{}');
    delete clientes[id];
    localStorage.setItem('clientes', JSON.stringify(clientes));

    window.location.href = '/';
  }

  const valorFinal = Object.entries(entries).reduce((acc, [id, entry]) => {
    if (entry.type === 'pagamento') {
      return acc - entry.valor;
    }
    let venda = entry as Venda;
    return acc + (venda.valor * venda.quantidade);
  }
  , 0);

  return (
    <div className={styles.container}>
      <div className={styles.divButton}>
        <div>
        <Link href={'/'}>
          <button className={styles.submitButton}>
            Pagina inicial
          </button>
        </Link>
        </div>
        <div>
          <button className={styles.submitButton} onClick={deleteClient}>
            Apagar usuário
          </button>
        </div>
      </div>
      <div className={styles.formGroup}>
        <h1 className={styles.h1Center}>Nova venda</h1>
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
              <button className={styles.submitButton}>confirmar</button>
            </div>
        </form>
        <form onSubmit={handleConfirm}>
          <div className={styles.saleSummary}>
            <h1 className={styles.h1Center}>Resumo da venda</h1>
            <p>Produto: {ProductName}</p>
            <p>Quantidade: {quantidade}</p>
            <p>Valor total: {`R$${valorTotal}`}</p>
          </div>
          <button 
            type="submit"
            className={styles.submitButton}
            disabled={ProductName === '' || valorTotal === 0 || quantidade === 0}
          >Confirmar venda</button>
        </form>
      </div>
      <div className={styles.formGroup}>
        <h1 className={styles.h1Center}>Novo pagamentos</h1>
        <form
          onSubmit={handlePay}
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
          <button className={styles.submitButton}>Confirmar pagamento</button>
        </form>
      </div>
      <div className={styles.entryList}>
        <h2>extrato</h2>
        <ul>
          {Object.entries(entries).map(([id, entry]) => {
            if (entry.type === 'pagamento') {
              return (
                <li key={id} className={styles.payment}>
                  <p>Pagamento: {entry.valor}</p>
                  <p>Data: {entry.date}</p>
                </li>
              );
            }
            let venda = entry as Venda;
            return (
              <li key={id} className={styles.sale}>
                <p>Produto: {venda.ProductName}</p>
                <p>Valor: {venda.valor}</p>
                <p>Quantidade: {venda.quantidade}</p>
                <p>Data: {venda.date}</p>
                <p>Valor total: {venda.valor * venda.quantidade}</p>
              </li>
            );
          })}
            <li>
              <p>Valor final: {`R$${valorFinal}`}</p>
            </li>
        </ul>
      </div>
    </div>
  );
}

export default Conta;