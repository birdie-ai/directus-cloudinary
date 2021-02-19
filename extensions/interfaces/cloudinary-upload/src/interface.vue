<template>
	<div>
        <vue-dropzone
            ref="myVueDropzone"
            id="customdropzone"
            :options="dropzoneOptions"
            :include-styling="false"
            :useCustomSlot="true"
            :destroyDropzone="false"
            v-on:vdropzone-thumbnail="customThumbnail"
            v-on:vdropzone-sending="onSending"
            v-on:vdropzone-success="onSuccess"
            v-on:vdropzone-removed-file="onRemoved"
        >
            <div class="dropzone-custom-content">
                <h3 class="dropzone-custom-title">Drag & Drop a Image Here</h3>
                <div class="subtitle">Click to Browse</div>
            </div>
        </vue-dropzone>
    </div>

</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import * as sha from 'js-sha1'

export default {
    name: 'Cloudinary Upload',
    inject: ['values'],
    props: {
        'value': String,
        'collection': String,
        'primaryKey': String,
        'field': String
    },
    data: () => ({
        apiUrl: process.env.CDN_API_URL,
        apiSecret: process.env.CDN_API_SECRET,
        apiKey: process.env.CDN_API_KEY
    }),
    components: {
        vueDropzone: vue2Dropzone
    },
    watch: {
        async value() {
            const url = this.value
            if (url) {
                const res = await fetch(url)
                if (res.ok) {
                    const size = res.headers.get("content-length")
                    const type = res.headers.get("content-type")
                    const file = { size, type, name: this.fileName || this.primaryKey }
                    this.$refs.myVueDropzone.manuallyAddFile(file, url)
                }
            }
        }
    },
    computed: {
        fileName() {
            const filename = String(this.values.value.name || this.values.value.id).toLowerCase().replace(/ /g, '_')
            return `${this.collection}/${filename}`
        },
        dropzoneOptions() {
            return {
                url: this.apiUrl + '/image/upload',
                previewTemplate: this.customTemplate,
                addRemoveLinks: true,
                maxFiles: 1,
                maxFilesize: 0.5,
                acceptedFiles: 'image/*',
                renameFile: this.fileName
            }
        },
        customTemplate() {
            return `
                <div class="dz-preview dz-file-preview">
                    <div class="dz-image">
                        <div data-dz-thumbnail-bg></div>
                    </div>
                    <div class="dz-details">
                        <div class="dz-size"><span data-dz-size></span></div>
                        <div class="dz-filename"><span data-dz-name></span></div>

                        <div class="tip">The file will be renamed when saved on Cloudinary</div>
                    </div>
                </div>
            `
        }
    },
    methods: {
        customThumbnail(file, dataUrl) {
            var j, len, ref, thumbnailElement;
            if (file.previewElement) {
                file.previewElement.classList.remove("dz-file-preview");
                ref = file.previewElement.querySelectorAll("[data-dz-thumbnail-bg]");
                for (j = 0, len = ref.length; j < len; j++) {
                    thumbnailElement = ref[j];
                    thumbnailElement.alt = file.name;
                    thumbnailElement.style.backgroundImage = 'url("' + dataUrl + '")';
                }
                return setTimeout(((function(_this) {
                    return function() {
                        return file.previewElement.classList.add("dz-image-preview");
                    };
                })), 1);
            }
        },
        generateSignature(publicId, timestamp) {
            const params = `public_id=${publicId}&timestamp=${timestamp}${this.apiSecret}`
            return sha.default.hex(params)
        },
        onSending(file, xhr, formData) {
            const timestamp = (new Date()).getTime().toString()

            formData.append('file', file.dataURL)
            formData.append('api_key', this.apiKey)
            formData.append('public_id', this.fileName)
            formData.append('timestamp', timestamp)
            formData.append('signature', this.generateSignature(this.fileName, timestamp))
        },
        onSuccess(file, response) {
            const { url } = response
            this.$emit('input', url.replace('http', 'https'))
        },
        onRemoved(file, error, xhr) {
            try {
                var xhr = new XMLHttpRequest(), formData = new FormData()

                xhr.open('POST',this.apiUrl + '/image/destroy');

                const timestamp = (new Date()).getTime().toString()

                formData.append('api_key', this.apiKey)
                formData.append('public_id', this.fileName)
                formData.append('timestamp', timestamp)
                formData.append('signature', this.generateSignature(this.fileName, timestamp))

                xhr.send(formData)

                this.resetDropzone()
                this.$emit('input', null)
            } catch(e) {
                console.log(e)
            }
        },
        resetDropzone() {
            this.$refs.myVueDropzone.removeAllFiles()
            this.$emit('input', null)
        }
    }
}
</script>

<style>
    #customdropzone {
        background: none;
        font-family: 'Arial', sans-serif;
        letter-spacing: 0.2px;
        color: #777;
        border: 2px dashed #455a64;
        border-radius: 4px;
        transition: 125ms cubic-bezier(0.4,0,0.2,1);
        height: 169px;
        overflow: hidden;
    }

    #customdropzone:hover {
        color: #2f80ed;
        border-color: #2f80ed;
        cursor: pointer;
    }

    #customdropzone .dz-preview {
        position: relative;
        display: flex;
        vertical-align: top;
        min-height: 100px;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: #263238;
    }

    #customdropzone .dz-preview .dz-image {
        flex: 2;
        height: 100%;
        width: 100%;
        max-width: 400px;
    }

    #customdropzone .dz-details {
        flex: 1;
    }

    #customdropzone .dz-remove {
        display: flex;
        justify-content: center;
        flex: 1;
    }

    #customdropzone .dz-preview .dz-image > div {
        width: inherit;
        height: inherit;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    #customdropzone .dz-preview .dz-image > img {
        width: 100%;
    }
    #customdropzone .dz-preview .dz-details {
        color: white;
        transition: opacity .2s linear;
        text-align: center;
    }
    #customdropzone .dz-success-mark, .dz-error-mark, .dz-remove {
        display: inline-block
    }

    #customdropzone .dropzone-custom-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }


    #customdropzone .dropzone-custom-title {
        color: #697a83;
        font-weight: 600;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: -.32px;
    }

    #customdropzone .subtitle {
        color: #697a83;
    }

    #customdropzone .tip {
        font-size: 12px;
        color: #736f6f;
        margin-top: 10px;
    }
</style>