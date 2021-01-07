import { Route } from '@arcaela/aurora';
import Login from '../views/Login'
/*
    El uso de Route está designado a la construcción de Vistas dinámicas
    con renderizado en tiempo real;
    A continuación se muestra la estructura completa.
    [ metodo(TypeOf) : Estado de uso ]

    @ Route(String, ReactNode) : Required | Optional
        .path(String) : Optional
        .render(ReactNode) : Optional
        .redirect(String) : Optional

    @ Route.fallback(ReactNode);

    @ URL Example:
        /path : Exactamente la ruta indicada
        /path? : Ruta Opcional
        /path/:username : $username [ Requerido ]
        /path/:username? : $username [ No Requerido ]

    - Las rutas son incorporadas en el orden que son declaradas.
    - Las rutas nuevas sobreescriben las previas.
*/



Route.redirect('/', '/login');
Route('/login', Login);
// Route('/', <Welcome />);
// Route('/welcome', (req)=>req.redirect('/'));
// Route('/', (req)=><Welcome tab="modal-card" {...req} />);
// Route('/profile/:username', ({params:{username}})=>req.redirect(`/${username}`));s