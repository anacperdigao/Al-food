import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

// QUINTO PASSO: se a gente for olhar na API, ela só esta entregando a primeira pagina, e a gente precisa pegar o
// resto, por isso vamos criar uma nova interface IPaginacao.ts pra tratar isso.

// SEGUNDO PASSO: vou deletar a lista de restaurantes anterior, nesse caso, vou só deixar comentado

const ListaRestaurantes = () => {
/*
  const restaurantes: IRestaurante[] = [
    {
      id: 1,
      nome: "Lyllys Cafe",
      pratos: [
        {
          id: 1,
          descricao: 'Lasanha à Bolonhesa',
          imagem: 'https://receitassaborosa.com/wp-content/uploads/2019/12/Lasanha-com-Molho-a-Bolonhesa.jpg',
          nome: 'Lasanha',
          restaurante: 1,
          tag: 'Italiana'
        },
        {
          id: 2,
          descricao: 'Strogonoff de Frango à brasileira',
          imagem: 'https://img.itdg.com.br/images/recipes/000/002/462/332854/332854_original.jpg',
          nome: 'Strogonoff',
          restaurante: 1,
          tag: 'Russa'
        },
        {
          id: 3,
          descricao: 'Empadão de Frango',
          imagem: 'https://t1.uc.ltmcdn.com/pt/images/5/7/1/img_como_fazer_empadao_de_frango_27175_600.jpg',
          nome: 'Empadão de Frango',
          restaurante: 1,
          tag: 'Portuguesa'
        }
      ]
    },
    {
      id: 2,
      nome: "Sugiro Sushi",
      pratos: [
        {
          id: 1,
          descricao: 'Combinado de 8 peças',
          imagem: 'https://www.sabornamesa.com.br/media/k2/items/cache/5031e263a4a258791d6306b2d3d9dbf6_XL.jpg',
          nome: 'Sushi',
          restaurante: 1,
          tag: 'Japonesa'
        },
        {
          id: 2,
          descricao: 'Sashimi de Salmão',
          imagem: 'https://www.comidaereceitas.com.br/img/sizeswp/1200x675/2009/04/sashimi_facil.jpg',
          nome: 'Sashimi',
          restaurante: 1,
          tag: 'Japonesa'
        }
      ]
    },
    {
      id: 3,
      nome: "Cantina da Escola",
      pratos: [
        {
          id: 1,
          descricao: 'Salgado de queijo com presunto',
          imagem: 'https://img.itdg.com.br/tdg/images/recipes/000/102/312/279767/279767_original.jpg',
          nome: 'Quejunto',
          restaurante: 1,
          tag: 'Lanche'
        },
        {
          id: 2,
          descricao: 'Coxinha de Frango',
          imagem: 'https://t1.rg.ltmcdn.com/pt/posts/1/9/1/coxinha_simples_191_600.jpg',
          nome: 'Coxinha',
          restaurante: 1,
          tag: 'Lanche'
        },
        {
          id: 3,
          descricao: 'Risole de Palmito',
          imagem: 'https://img.itdg.com.br/tdg/images/recipes/000/005/116/323871/323871_original.jpg',
          nome: 'Risole',
          restaurante: 1,
          tag: 'Lanche'
        }
      ]
    }
  ]
  */

  //TERCEIRO PASSO: vou adicionar a lista de restaurantes pelo useState
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])

  // SEXTO PASSO: criar o link para a próxima pagina e depois vou chamar embaixo do primeiro THEN
  const [proximaPagina, setProximaPagina] = useState('')
  

  // PRIMEIRO PASSO: Vou começar aqui a fazer a requisição da API pelo hook use Effect
  // Esse hook aceita dois parâmetros: 
  // 1 - o que eu quero executar, nesse caso é obter restaurantes
  // 2 - lista de dependencias para essa função executar, nesse caso posso deixar vazio [] e o React entende que 
  // só vai criar uma vez quando o componente for montado.
  /* MAIS SOBRE useEffect: Componentes são funções JavaScript e, por isso, quando um componente é atualizado, a função
  é executada. Com o useEffect, podemos deixar para que o React gerencie as execuções, tornando possível executar a 
  requisição apenas uma vez. */

  useEffect(() => {

    axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/')

      .then(resposta => { //a resposta vem do backend e eu posso inpecionar no devtools na parte de Network
        setRestaurantes(resposta.data.results)//QUARTO PASSO: adicionar o caminho para pegar a resposta no JSON
        setProximaPagina(resposta.data.next)
      })

      .catch(erro => {
        console.log(erro)// Aqui eu poderia fazer algo para tratar o erro, nesse caso nao to fazendo nada
      })
  }, [])

  const verMais = () => {
    axios.get<IPaginacao<IRestaurante>>(proximaPagina)
      .then(resposta => { 
        setRestaurantes([...restaurantes, ...resposta.data.results]) // Aqui eu to dizendo pra concatenar dois arrays, array da primeira pagina e array da segunda pagina
        setProximaPagina(resposta.data.next)
      })

      .catch(erro => {
        console.log(erro)
      })
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {proximaPagina && <button onClick={verMais}>
      Ver mais
    </button>}
  </section>)
}
//SETIMO PASSO: criar um botao VER MAIS onde eu chamo o proximaPagina e vou criar uma funcao no onclick


export default ListaRestaurantes