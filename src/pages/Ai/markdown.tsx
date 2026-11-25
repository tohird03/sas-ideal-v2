import React from 'react';
import { ChartBlock } from './ChartBlock';
import { MdTable } from './MdTable';

// Komponent har renderda yangi yaratilmasligi uchun modul darajasida turadi
export const mdComponents = {
  table: MdTable,

  // ```chart bloki -> grafik
  code({ className, children, ...props }: any) {
    if (/language-chart/.test(className ?? '')) {
      return <ChartBlock source={String(children).trim()} />;
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // grafik <pre> ichida o'ralib qolmasin
  pre({ children }: any) {
    const child = Array.isArray(children) ? children[0] : children;
    if (/language-chart/.test(child?.props?.className ?? '')) return <>{children}</>;
    return <pre>{children}</pre>;
  },
};
