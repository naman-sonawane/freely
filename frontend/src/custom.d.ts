import { MuxPlayer } from '@mux/mux-player';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mux-player': MuxPlayer;
    }
  }
}

declare module "*.svg" {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
