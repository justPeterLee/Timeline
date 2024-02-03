// libraries
import { configureStore } from "@reduxjs/toolkit";
// import { logger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

// modules
import { rootReducer } from "./reducers/_root.reducer";
import rootSaga from "./saga/_root.sage";

// middleware
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

sagaMiddleware.run(rootSaga);

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
