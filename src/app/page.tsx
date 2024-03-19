import Image from "next/image";
import styles from "./page.module.css";
import Clientes from "./componentes/Clientes.client";

export default function Home() {
  return (
    <main>
      <div>
        <Clientes />
      </div>
    </main>
  );
}
