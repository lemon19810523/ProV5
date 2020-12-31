// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    hasPermission: (pageCode: string, permission: string) => {
      if (pageCode === 'parts-Order' && permission === 'add') {
        return true;
      }
      return false;
    }
  };
}
