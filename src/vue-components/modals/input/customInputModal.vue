<template>
    <div class="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container" @keydown.27="cancel()" @keydown.enter="save()">
                    <a class="inline close-button" href="javascript:void(0);" @click="cancel()"><i class="fas fa-times"/></a>
                    <a class="close-button" href="javascript:;" @click="openHelp()"><i class="fas fa-question-circle"></i></a>
                    <div class="modal-header">
                        <h1 name="header">Custom Input</h1>
                    </div>

                    <div class="modal-body" v-if="inputConfig">
                        <div class="srow" >
                            <div class="twelve columns">
                                <input v-focus type="checkbox" id="enableCustom" v-model="inputConfig.customEnabled"/>
                                <label class="inline" for="enableCustom">Select with custom input</label>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <div class="button-container srow">
                            <button @click="cancel()" class="four columns offset-by-four">
                                <i class="fas fa-times"/> <span>{{ $t('cancel') }}</span>
                            </button>
                            <button @click="save()" class="four columns">
                                <i class="fas fa-check"/> <span>{{ $t('ok') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {dataService} from '../../../js/service/data/dataService'
import {helpService} from "../../../js/service/helpService";
import {i18nService} from "../../../js/service/i18nService";
import Accordion from "../../components/accordion.vue"
import InputEventList from "../../components/inputEventList.vue"
import TestArea from "./testArea.vue"
import './../../../css/modal.css';
import {InputConfig} from "../../../js/model/InputConfig";
import {inputEventHandler} from "../../../js/input/inputEventHandler";
import {CustomInput} from "../../../js/input/customInput";

export default {
    props: [],
    components: {Accordion, InputEventList, TestArea},
    data: function () {
        return {
            inputConfig: null,
            metadata: null,
            InputConfig: InputConfig,
            clicker: null,
            hover: null,
            testOpen: false,
            selectedTestElement: null,
            customInput: null
        }
    },
    watch: {
        inputConfig: {
            handler: function(newConfig) {
                if (this.testOpen) {
                    this.initTest(newConfig);
                }
            },
            deep: true
        }
    },
    methods: {
        save() {
            this.metadata.inputConfig = this.inputConfig;
            dataService.saveMetadata(this.metadata).then(() => {
                this.$emit('close');
            });
        },
        cancel() {
            this.$emit('close');
        },
        openHelp() {
            helpService.openHelp();
        },
        initTest() {
            setTimeout(() => {
                let thiz = this;
                thiz.stopTest();
                if (thiz.inputConfig.customEnabled) {
                    this.customInput = CustomInput.getInstanceFromConfig();
                    this.customInput.start();
                }
            }, 100);
        },
        stopTest() {
            if (this.customInput) {
                this.customInput.destroy();
            }
        }
    },
    mounted () {
        let thiz = this;
        inputEventHandler.pauseAll();
        dataService.getMetadata().then(metadata => {
            thiz.metadata = JSON.parse(JSON.stringify(metadata));
            thiz.inputConfig = JSON.parse(JSON.stringify(metadata.inputConfig));
        });
        helpService.setHelpLocation('04_input_options', '#mousetouch-input');
    },
    beforeDestroy() {
        helpService.revertToLastLocation();
        this.stopTest();
        inputEventHandler.resumeAll();
    }
}
</script>

<style scoped>
</style>