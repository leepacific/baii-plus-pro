// PAGE-001 (`/`). Footer disclaimer — TASK-051. Pulls verbatim from /core/legal.ts.
import { DISCLAIMER } from '../core/legal';

export const renderFooter = (): HTMLElement => {
  const footer = document.createElement('footer');
  footer.textContent = DISCLAIMER;
  return footer;
};
