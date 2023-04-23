import { filter, map, mergeMap, shareReplay } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

export const getCurrentId = (
  router: Router,
  activatedRoute: ActivatedRoute
) => {
  return router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => activatedRoute),
    map((route) => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    mergeMap((route) => route.params),
    map((params) => params['id'] || null),
    shareReplay({
      bufferSize: 1,
      refCount: true
    })
  );
};
