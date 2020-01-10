export default {
    getStorageItem: function(key) {
        var value = localStorage.getItem(key)
        return value ? JSON.parse(value) : false
    },
    setStorageItem: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    removeStorageItem: function(key) {
        localStorage.removeItem(key);
    },
    clearStorage: function() {
        localStorage.clear();
    }
};