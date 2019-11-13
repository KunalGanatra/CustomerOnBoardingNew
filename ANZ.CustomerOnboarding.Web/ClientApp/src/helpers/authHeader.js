import { authenticationService } from '../services/authentication.service';

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return  `Bearer ${currentUser.token}` ;
    } else {
        return {};
    }
}