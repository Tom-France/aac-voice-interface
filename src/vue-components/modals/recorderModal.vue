<template>
  <div class="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" @keyup.27="close()">
          <p>{{ `Click on the button to start recording the name the card (${cardName})` }}</p>
          <template v-if="!hasRecord">
            <RecorderModalVisualizer v-if="stream" :stream="stream" />
            <div class="buttons">
              <button class="start" @click="startRecord" :disabled="isRecording">Start the recording</button>
              <button class="stop" @click="stopRecord" :disabled="!isRecording">Stop the recording</button>
            </div>
          </template>

          <article :class="hasRecord ? 'show' : 'hide'">
            <audio :src="audioUrl" controls />
            <div class="buttons">
              <button class="save" @click="saveRecord">{{ `Save (${cardName})`}}</button>
              <button class="reset" @click="resetRecord">Reset</button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecorderModalVisualizer from "./recorderModalVisualizer.vue";

const toBlob = (chunks) => new Blob(chunks, { type: 'video/webm; codecs=vp9' });
const toUrl = (blob) => window.URL.createObjectURL(blob);

export default {
  props: ["cardName"],
  data() {
    return {
      isRecording: false,
      stream: undefined,
      mediaRecorder: undefined,
      recordedChunks: [],
    };
  },
  computed: {
    hasRecord() {
      return this.recordedChunks && this.recordedChunks.length > 0;
    },
    audioUrl() {
      return this.hasRecord && toUrl(toBlob(this.recordedChunks));
    },
  },
  methods: {
    startRecord() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.isRecording = true;
        this.stream = stream;
        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: "video/webm; codecs=vp9" });
        this.mediaRecorder.ondataavailable = (event) => this.recordedChunks.push(event.data);
        this.mediaRecorder.start();
      });
    },
    stopRecord() {
      if (this.mediaRecorder.state === 'recording') {
        this.isRecording = false;
        this.mediaRecorder.stop();
        this.stream = undefined;
        this.mediaRecorder = undefined
      }
    },
    saveRecord() {
      this.upload();
      this.close();
    },
    resetRecord() {
      window.URL.revokeObjectURL(this.audioUrl);
      this.recordedChunks = [];
      this.stream = undefined;
      this.mediaRecorder = undefined
    },
    download() {
      // const a = document.createElement("a");
      // document.body.appendChild(a);
      // a.style = "display: none";
      // a.href = this.audioUrl;
      // a.download = "test.webm";
      // a.click();
      // this.resetRecord();
    },
    upload() {
      const data = new FormData()
      data.append('file', toBlob(this.recordedChunks), (new Date()).getTime())
      data.append('text', this.cardName)

      fetch('http://localhost:3000/upload', { method: 'POST', body: data });
    },
    close() {
      this.$emit('close');
    }
  },
  components: { RecorderModalVisualizer }
}
</script>

<style scoped>

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.buttons button {
  font-size: 1rem;
  padding: 1rem;
  width: calc(50% - 0.25rem);
  margin-bottom: 0.5rem;
}

article {
  display: flex;
  flex-direction: column;
}

article.hide {
  display: none;
}

audio {
  margin: auto;
  margin-bottom: 0.5rem;
}
</style>
