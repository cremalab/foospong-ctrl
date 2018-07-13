import './global.css';
import Nes from 'nes';

const wsClient = new Nes.Client('ws://b30cf627.ngrok.io');
const globs = {
  id: 0,
  isConnected: false,
};

const startSocket = async () => {
  await wsClient.connect();
  globs.isConnected = true;
  wsClient.onDisconnect = () => {
    console.log('socket disconnected');
    globs.isConnected = false;
  };
};

const sendSocketEvent = (event: string) => {
  // send websocket event
  if (!globs.isConnected || globs.id === 0) return;
  console.log('sending ' + event);
  wsClient.request({
    method: 'POST',
    path: `/player/${globs.id}`,
    payload: {
      event
    }
  });
};

const addBtnHandler = (btnId: string, direction: string) => {
  const btn = document.getElementById(btnId) as HTMLButtonElement;
  console.log(btn);
  if (!btn) return;
  btn.ontouchstart = () => sendSocketEvent(direction + '_press');
  btn.onpointerdown = () => sendSocketEvent(direction + '_press');
  btn.ontouchend = () => sendSocketEvent(direction + '_release');
  btn.onpointerup = () => sendSocketEvent(direction + '_release');
};

addBtnHandler('btnDown', 'down');
addBtnHandler('btnUp', 'up');

const select = document.getElementById('playerId') as HTMLSelectElement;

select.onchange = (e: any) => {
  const val = e.target.selectedIndex;
  globs.id = val;
  console.log('Player Id now ' + val);
};

startSocket();