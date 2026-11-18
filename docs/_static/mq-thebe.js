(function () {
  const isZH = document.documentElement.lang.toLowerCase().startsWith('zh');
  const T = isZH ? {
    banner: '本页示例可在线运行。',
    activate: '激活',
    runAll: '全部运行',
    runCell: '运行此单元',
    dismiss: '关闭',
    loading: '正在加载 Thebe…',
    starting: 'Binder 正在启动服务…',
    connecting: '正在连接内核…',
    ready: '已激活',
    reconnecting: '正在重新连接内核…',
    disconnected: '内核已断开。请刷新页面重试。',
    error: '启动失败。请刷新页面重试。'
  } : {
    banner: 'This page is runnable in your browser.',
    activate: 'Activate',
    runAll: 'Run all',
    runCell: 'Run cell',
    dismiss: 'Dismiss',
    loading: 'Loading Thebe…',
    starting: 'Starting Binder server…',
    connecting: 'Connecting to kernel…',
    ready: 'Activated',
    reconnecting: 'Reconnecting to kernel…',
    disconnected: 'Kernel disconnected. Reload to try again.',
    error: 'Failed to start. Reload to try again.'
  };

  function loadThebe() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = THEBE_JS_URL;
      script.onload = () => resolve(window.thebelab);
      script.onerror = () => reject(new Error('Could not load Thebe'));
      document.head.appendChild(script);
    });
  }

  function init() {
    const article = document.querySelector('article.bd-article');
    if (!article || !document.querySelector('script[type="text/x-thebe-config"]')) return;

    const cells = Array.from(article.querySelectorAll('.cell.docutils.container'))
      .filter((cell) => !cell.closest('.thebe-ignored'))
      .map((cell) => ({
        input: cell.querySelector('.cell_input'),
        source: cell.querySelector('.cell_input pre'),
        output: cell.querySelector('.cell_output')
      }))
      .filter(({ source }) => source);
    if (!cells.length) return;

    const banner = document.createElement('div');
    banner.className = 'mq-thebe-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', T.banner);
    banner.innerHTML = `
      <div class="mq-text">${T.banner} <span class="mq-kernel-status" role="status"></span></div>
      <div class="mq-actions" role="group">
        <button type="button" class="mq-btn mq-btn-run mq-btn-compact mq-activate">
          <span class="mq-icon mq-icon-rocket" aria-hidden="true"></span> ${T.activate}
        </button>
        <button type="button" class="mq-btn mq-btn-outline mq-btn-compact mq-run-all">
          <span class="mq-icon mq-icon-play" aria-hidden="true"></span> ${T.runAll}
        </button>
        <button type="button" class="mq-btn mq-btn-ghost mq-btn-compact mq-dismiss" aria-label="${T.dismiss}" title="${T.dismiss}"><span class="mq-icon mq-icon-close" aria-hidden="true"></span></button>
      </div>`;
    article.prepend(banner);

    const status = banner.querySelector('.mq-kernel-status');
    const activate = banner.querySelector('.mq-activate');
    const runAll = banner.querySelector('.mq-run-all');
    let state = 'idle';
    let thebe;

    function setState(next) {
      if (state === next) return;
      state = next;
      banner.dataset.kernelState = next;
      status.textContent = T[next];
      activate.disabled = true;
      runAll.disabled = next !== 'ready';
      for (const { button } of cells) button.disabled = true;
    }

    async function start() {
      setState('loading');
      thebe = await loadThebe();
      if (!thebe.getOption('binderOptions').repo) throw new Error('Missing Binder repository');

      const mode = thebe.getOption('codeMirrorConfig').mode;
      const onStatus = (_event, { status }) => {
        if (status === 'starting') setState('connecting');
      };
      setState('starting');
      thebe.on('status', onStatus);
      let kernel;
      try {
        kernel = await thebe.bootstrap({
          requestKernel: true,
          // Binder serves mq-env, not the tutorial's source directory.
          kernelOptions: { path: '.' },
          preRenderHook: () => {
            for (const { source, output } of cells) {
              source.dataset.executable = 'true';
              source.dataset.language = mode;
              if (output) {
                output.dataset.output = '';
                source.after(output);
              }
            }
          }
        });
      } finally {
        thebe.off('status', onStatus);
      }

      let hasKernelInfo = false;
      function syncConnection() {
        if (kernel.isDisposed || kernel.status === 'dead' || kernel.status === 'terminating' ||
            kernel.connectionStatus === 'disconnected') {
          setState('disconnected');
        } else if (hasKernelInfo) {
          setState(kernel.connectionStatus === 'connected' ? 'ready' : 'reconnecting');
        }
      }
      kernel.connectionStatusChanged.connect(syncConnection);
      kernel.statusChanged.connect(syncConnection);
      kernel.disposed.connect(syncConnection);
      syncConnection();

      // Thebe renders its editors before the Jupyter kernel answers.
      await kernel.info;
      hasKernelInfo = true;
      for (const { button } of cells) button.remove();
      syncConnection();
    }

    async function withKernel(run) {
      if (state === 'idle') {
        try {
          await start();
        } catch (error) {
          console.error('Thebe activation failed:', error);
          setState('error');
        }
      }
      if (state === 'ready') run?.();
    }

    activate.addEventListener('click', () => withKernel());
    runAll.addEventListener('click', () => withKernel(() => {
      for (const { execute } of thebe.cells.get()) execute();
    }));
    banner.querySelector('.mq-dismiss').addEventListener('click', () => banner.remove());

    for (const [index, cell] of cells.entries()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mq-run-btn';
      button.setAttribute('aria-label', T.runCell);
      button.title = T.runCell;
      button.innerHTML = '<span class="mq-icon mq-icon-play" aria-hidden="true"></span>';
      button.addEventListener('click', () => withKernel(() => thebe.cells.get(index).execute()));
      cell.button = button;
      cell.input.appendChild(button);
    }
  }

  document.addEventListener('DOMContentLoaded', init, { once: true });
})();
