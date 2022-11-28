import { useDispatch , useSelector} from "react-redux";
import { RootState, AppDispatch } from "../Redux/store";
import { TypedUseSelectorHook } from 'react-redux/es/types';

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector