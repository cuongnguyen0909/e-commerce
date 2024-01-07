import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import productSlice from './products/productSlice';
import userSlice from './user/userSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';


//define config for all slice of store except user slice
const commonConfig = {
    key: 'shop/user',
    storage
}
// define config for user slice only
//using ... to copy all properties from commonConfig to userConfig and add more properties
const userConfig = {
    ...commonConfig,
    whitelist: ['isLoggedIn', 'token', 'current', 'currentCart']
}

export const store = configureStore({
    //define reducer for store
    reducer: {
        //define reducer for each slice of store
        app: appSlice,
        products: productSlice,
        //using persistReducer to wrap userSlice reducer and config to persist userSlice reducer only
        user: persistReducer(userConfig, userSlice)
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,],
        }

    })
});

export const persistor = persistStore(store);