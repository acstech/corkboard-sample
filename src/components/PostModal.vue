<template>
    <div class="modal-mask" id="mask" transition="modal">
        <div class="modal-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  mounted () {
    var vm = this
    document.addEventListener('click', function (e) {
      if (e.target.id === 'mask') {
        vm.$router.push('/')
      }
    })
  }
}
</script>

<style scoped>

</style>
