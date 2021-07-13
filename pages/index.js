import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'

function ProfileSideBar(propriedades) {
  return(
    <Box>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px'}}></img>
    </Box>
  )
}

export default function Home() {

  const usuarioAleatorio = 'King-bowie';
  const pessoasFavoritas = [
  'peas',
  'omariosouto',
  'juunegreiros',
  'rafaballerini',
  'marcobrunodev',
  'felipefialho'
]

  return( 
    <>
      <AlurakutMenu/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <Box >
            <ProfileSideBar githubUser={usuarioAleatorio}/>
            <h4>
              {usuarioAleatorio}
            </h4>

            <AlurakutProfileSidebarMenuDefault/>
            
          </Box>
        </div>
        <div  className="welcomeArea" style={{ gridArea: 'welcomeArea'}}>
          <Box>
            <b>Bem vindo(a) </b>
            <OrkutNostalgicIconSet/>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea'}}>
          <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
            <b>Pessoas da comunidade</b> ({pessoasFavoritas.length})
            </h2>
            <ul>
            {pessoasFavoritas.map((itemAtual) => {
              return (
                <li>
                  <a href={`/users/${itemAtual}`} key={itemAtual}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                  </a>
                </li>
              )
            })} 
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box >
            <b>Comunidade</b>
          </Box>
        </div>
      </MainGrid>
    </>
  )
}
