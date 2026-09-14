import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserState } from '../../states/user.state';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject UserState
  const userState = inject(UserState);

  // Get Current User From Signal
  const user = userState.currentUser();

  // Check Token Available
  if (user && user.token) {
    // Set Token To Request Header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    // Return Request Header
    return next(authReq);
  }

  // Return Request Header Whit No Token
  return next(req);
};
