import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'

function ProfileSideBar(propriedades) {
  return(
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px'}}/>
      <hr/>
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr/>

      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
          {/* {{comunidades.map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a href={`/users/${itemAtual.title}`}>
                    {<img src={itemAtual.image} />}
                    <span>{itemAtual.title}</span>
                </a>
              </li>
            )
          })} } */} 
        </ul>
  </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {
  
  const usuarioAleatorio = props.githubUser;
  const [comunidades, setComunidades] = React.useState([
    {
    //   id: '132',
    //   title: 'Oh noo!',
    //   image: 'https://ogimg.infoglobo.com.br/in/23638624-fd4-52a/FT1086A/filme-sonic.jpg'
  }]);
  const pessoasFavoritas = [
  'peas',
  'omariosouto',
  'juunegreiros',
  'rafaballerini',
  'marcobrunodev',
  'felipefialho'
]

const [seguidores, setSeguidores] = React.useState([]);
// 0 - pegar o array de dados do github
React.useEffect(function(){
  fetch('https://api.github.com/users/King-Bowie/following')
  .then(function (respostaDoServidor){
    return respostaDoServidor.json();
  })
  .then(function(respostaCompleta){
    setSeguidores(respostaCompleta);
  })
  //API GraphQL
  fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Authorization': 'a1548e89482962db1dc5ac96cb6482',
      'Content-type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ "query": `query{
      allCommunities {
        title
        imageUrl
        id
        creatorSlug
      }
    }` })
  })
  .then((response) => response.json())
  .then((respostaCompleta) => {
    const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
    console.log(comunidadesVindasDoDato)
    setComunidades(comunidadesVindasDoDato)
  })

}, [])

  return( 
    <>
      <AlurakutMenu/>
      <MainGrid>
          <div className="profileArea" style={{ gridArea: 'profileArea' }}>
            <ProfileSideBar githubUser={usuarioAleatorio} />
          </div>
          <div  className="welcomeArea" style={{ gridArea: 'welcomeArea'}}>
          <Box>
            <b>Bem vindo(a) </b>
            <OrkutNostalgicIconSet/>
          </Box>
          <Box>
              <h2 className="subTitle">O que você deseja fazer?</h2>
              <form onSubmit={function handleCriaComunidade(e) { // esse e é um para evento
                e.preventDefault();

                const dadosDoFormulario = new FormData(e.target);

                  const comunidade = {
                  title:  dadosDoFormulario.get('title'),
                  imageUrl: dadosDoFormulario.get('image'),
                  creatorSlug: usuarioAleatorio,
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async(response)=>{
                  const dados = await response.json();
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                  console.log(comunidadesAtualizadas);
                })

                
              }}>
                <div>
                    <input 
                    placeholder="Qual vai ser o nome da sua comunidade?" 
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"/>
                </div>
                <div>
                  <input
                    placeholder="Coloque uma URL de uma imagem para usarmos de capa." 
                    name="image"
                    aria-label="Coloque uma URL de uma imagem para usarmos de capa."/>
                </div>
                <button>
                  Criar comunidade
                </button>
              </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea'}}>
          <ProfileRelationsBox title="Seguidores" items={seguidores}/>
          <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
            <b>Pessoas da comunidade</b> ({pessoasFavoritas.length})
            </h2>
            <ul>
            {pessoasFavoritas.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                  </a>
                </li>
              )
            })} 
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box >
            <b>Comunidade ({comunidades.length})</b>
            <ProfileRelationsBoxWrapper>
        <ul>
            {comunidades.map((itemAtual) => {
              return (
                <li key={itemAtual.id}>
                  <a href={`/comunidades/${itemAtual.id}`}>
                      {<img src={itemAtual.imageUrl} />}
                      <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })} 
            </ul>
        </ProfileRelationsBoxWrapper>
          </Box>
        </div>
      </MainGrid>
    </>
  )
}


export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN
  const decodeToken = jwt.decode(token);
  const githubUser  = decodeToken?.githubUser;
  
  if(!githubUser){
    return{
      redirect:{
        destination: '/login',
        permanent: false,
      }
    }
  }

  return{
    props: {
      githubUser,
    }
  }
}