<template>
    <div class="modal-mask" id="mask" transition="modal">
        <div class="modal-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  compute: {
    getCurrentUser () {
      return this.$store.state.currentUser
    },
    currentPost () {
      return this.$store.state.activePost
    }
  },
  mounted () {
    // var vm = this
    document.addEventListener('click', function (e) {
      if (e.target.id === 'mask') {
        // vm.$router.back()
      }
    })
  }
}
</script>

<style scoped>

</style>
