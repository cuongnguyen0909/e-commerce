Su dung redux toolkit
1. Tao action (trong store -> asyncAction)
    1.1 Trong action nay goi API server -> tra ve ket qua
2. tao slice (trong store -> appSlice)
    2.1 Export appSlice.reducer vi no bao gom 2 cai reducers va extraReducers
3. Dinh nghia appslice trong store (minh dat ten la redux.js trong folder store)
    3.1 Muc dich la dung de lay duoc data trong store
4. vao file index.js (file root khai bao store do)
5. vao App.js -> su dung useDispatch cua redux -> cho dep gui cac actions den store cua redux
    5.1 Luu y phai goi dung action da khai bao (vi du trong project la asyncAction.js)
6. Sau do su dung useSelector de lay trong store cua redux va trar ve ket qua mong muon