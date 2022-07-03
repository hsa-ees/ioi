<template>
  <div ref="jitsiContainer" style="height: 100%; width: 100%;"></div>
</template>

<script>
export default {
  name: 'JitsiMeet',
  inject: ['RpgGui'],
  props: {
    domain: {
      type: String,
      default: 'meet.jit.si'
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  /**
   * Loads our Script and Activates the widget.
   */
  mounted () {
    this.loadScript('https://meet.jit.si/external_api.js', () => {
      if (!window.JitsiMeetExternalAPI) throw new Error('Jitsi Meet API not loaded');
      this.embedJitsiWidget();
    });
  },
  beforeUnmount () {
    this.removeJitsiWidget();
  },
  methods: {
    /**
     * Load the document which ist given by src and makes a Callback
     * @param src
     * @param cb
     */
    loadScript (src, cb) {
      const scriptEl = document.createElement('script');
      scriptEl.src = src;
      scriptEl.async = true;
      document.querySelector('head').appendChild(scriptEl);
      scriptEl.addEventListener('load', cb);
    },
    /**
     * Makes the Jisti-Meet visible and adds it to our window
     */
    embedJitsiWidget () {
      const options = {
        ...this.options,
        parentNode: this.$refs.jitsiContainer,
      };
      this.jitsiApi = new window.JitsiMeetExternalAPI(this.domain, options);
    },
    /**
     * Option for using jitsi API commands.
     * Can be looked up on Jitsi Documentation.
     * @param command
     * @param value
     */
    executeCommand (command, ...value) {
      this.jitsiApi.executeCommand(command, ...value);
    },
    /**
     * Option for using jitsi API EventListener.
     * Can be looked up on Jitsi Documentation.
     * @param event
     * @param fn
     */
    addEventListener (event, fn) {
      this.jitsiApi.on(event, fn);
    },
    // Misc
    removeJitsiWidget () {
      if (this.jitsiApi) this.jitsiApi.dispose();
    },
  }
};
</script>
