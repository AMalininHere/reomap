import { createContext, useContext } from 'react';
import { ContextState } from '../context';

const ctx = createContext<ContextState>(null!);
ctx.displayName = 'SvgLayerContext';

export const SvgLayerProvider = ctx.Provider;

export function useSvgLayerContext() {
  const data = useContext(ctx);

  return data;
}
