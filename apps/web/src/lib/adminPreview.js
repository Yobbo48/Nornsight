export const ADMIN_PREVIEW_EMAIL = 'test@test.fr';
export const ADMIN_PREVIEW_PARAM = 'preview_paid';

export const isAdminPreviewEnabled = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get(ADMIN_PREVIEW_PARAM) === '1';
};

export const buildAdminPreviewQuery = (params = {}) => {
  const searchParams = new URLSearchParams({
    [ADMIN_PREVIEW_PARAM]: '1',
    ...params
  });

  return searchParams.toString();
};
