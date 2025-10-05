import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Force purely client rendering to avoid server-side HTTP fetch issues during dev/prerender
  { path: '**', renderMode: RenderMode.Client },
];
