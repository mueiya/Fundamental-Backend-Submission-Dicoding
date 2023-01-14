const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlist',
    handler: handler.postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlist',
    handler: handler.getPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '/playlist/{id}',
    handler: handler.deletePlaylistHandler,
  },
  {
    method: 'POST',
    path: '/playlist/{id}/songs',
    handler: handler.postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlist/{id}/songs',
    handler: handler.getPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '//playlist/{id}/songs',
    handler: handler.deletePlaylistHandler,
  },
];

module.exports = routes;
