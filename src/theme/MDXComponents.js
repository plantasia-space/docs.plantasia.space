import MDXComponents from '@theme-original/MDXComponents';
import ModulePicture, { Dot } from '@site/src/components/docs/ModulePicture';
import Term from '@site/src/components/docs/Term';
import StepFlow from '@site/src/components/docs/StepFlow';
import Walkthrough from '@site/src/components/docs/Walkthrough';
import TryModule from '@site/src/components/docs/TryModule';
import LoopVideo from '@site/src/components/docs/LoopVideo';
import IsoFigure from '@site/src/components/docs/IsoFigure';

// Available on every docs page without an import.
export default {
  ...MDXComponents,
  ModulePicture,
  Dot,
  Term,
  StepFlow,
  Walkthrough,
  TryModule,
  LoopVideo,
  IsoFigure,
};
