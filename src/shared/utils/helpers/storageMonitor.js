class StorageMonitor {
  constructor() {
    this.originalSetItem = localStorage.setItem;
    this.originalRemoveItem = localStorage.removeItem;
    this.originalClear = localStorage.clear;
    this.setupMonitoring();
  }

  setupMonitoring() {
    // Monitor setItem
    localStorage.setItem = (key, value) => {
      if (key === 'authToken' || key === 'user') {
        console.log('🔍 localStorage.setItem called:', {
          key,
          valueLength: value?.length,
          valuePreview: value?.substring(0, 50),
          stack: new Error().stack.split('\n').slice(1, 4).map(line => line.trim())
        });
      }
      return this.originalSetItem.call(localStorage, key, value);
    };

    // Monitor removeItem
    localStorage.removeItem = (key) => {
      if (key === 'authToken' || key === 'user') {
        console.log('🗑️ localStorage.removeItem called:', {
          key,
          existingValue: localStorage.getItem(key)?.substring(0, 30),
          stack: new Error().stack.split('\n').slice(1, 4).map(line => line.trim())
        });
      }
      return this.originalRemoveItem.call(localStorage, key);
    };

    // Monitor clear
    localStorage.clear = () => {
      console.log('🧹 localStorage.clear called:', {
        authToken: localStorage.getItem('authToken')?.substring(0, 30),
        user: localStorage.getItem('user')?.substring(0, 30),
        stack: new Error().stack.split('\n').slice(1, 4).map(line => line.trim())
      });
      return this.originalClear.call(localStorage);
    };
  }

  destroy() {
    localStorage.setItem = this.originalSetItem;
    localStorage.removeItem = this.originalRemoveItem;
    localStorage.clear = this.originalClear;
  }

  // Manual check storage state
  checkState() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    console.log('📊 Storage State Check:', {
      timestamp: new Date().toISOString(),
      hasToken: !!token,
      hasUser: !!user,
      tokenLength: token?.length,
      userLength: user?.length,
      tokenPreview: token?.substring(0, 20),
      userPreview: user?.substring(0, 50)
    });

    return { token, user };
  }
}

// Create global monitor instance
export const storageMonitor = new StorageMonitor();

export default storageMonitor;