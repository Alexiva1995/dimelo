import { Route } from '@arcaela/aurora/hooks';
import Auth from '../views/Auth'
Route.case = (cases, Component)=>cases.map(path=>Route(path, Component));


Route.redirect('/', '/signin');
Route.case([ '/signin', '/signup', '/signup-more', '/forgot', ], Auth);