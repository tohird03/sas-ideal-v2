import 'dayjs/locale/uz-latn';

import React from 'react';
import {createRoot} from 'react-dom/client';
import dayjs from 'dayjs';
import {App} from '@/App';

dayjs.locale('uz-latn');

const container = document.getElementById('root');
const root = createRoot(container!);


root.render(<App />);
