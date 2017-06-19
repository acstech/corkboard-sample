<template>
    <div class="modal-mask" @click="close" transition="modal">
        <div class="modal-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style scoped>

</style>
