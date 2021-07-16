import { SiteClient } from 'datocms-client';

export default async function receberDeRequests(request, response){
    if(request.method === 'POST'){
      
        const TOKEN = 'c9a39e58b53a24b4dbb4171e871b94';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "972989",
            ...request.body, 
            // title: "Comunidade de teste",
            // imageUrl: "https://github.com/users/omariosouto.png",
            // creatorSlug: "king",
        })

        console.log(registroCriado);

        response.json({
            dados: 'algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda nao temos nada no get, mas no post tem!'
    })
}