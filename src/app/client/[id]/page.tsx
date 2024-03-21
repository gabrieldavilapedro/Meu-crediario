import Conta from '../../componentes/Conta.client';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main>
      <div>
        <Conta id={params.id} />
      </div>
    </main>
  );
}
