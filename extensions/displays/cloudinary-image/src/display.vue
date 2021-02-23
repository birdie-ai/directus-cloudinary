<template>
    <div
        class="cloudinary-image-row"
        :style="backgroundImg"
    />
</template>

<script>
export default {
    props: {
        value: String
    },
    data() {
        return {
            backgroundImg: {
                backgroundImage: `url(${this.value})`
            }
        }
    }
}
</script>

<style scoped>
.cloudinary-image-row {
    display: inline-block;
    height: 32px;
    width: 32px;
    border-radius: 4px;
    vertical-align: -30%;
    background-size:contain;
    background-repeat: no-repeat;
    background-position: center;
}
</style>