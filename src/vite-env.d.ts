/// <reference types="vite/client" />

interface SvgrComponent
  extends React.FunctionComponent<React.SVGAttributes<SVGElement>> {}

declare module "*.svg?react" {
  const ReactComponent: SvgrComponent;
  export default ReactComponent;
}