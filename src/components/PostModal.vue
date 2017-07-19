<template>
    <div class="modal-mask" id="mask" transition="modal">
        <div class="modal-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  computed: {
    getCurrentUser () {
      return this.$store.state.currentUser
    },
    currentPost () {
      return this.$store.state.activePost
    }
  },
  mounted () {
    // var vm = this
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
      }
    })
  }
}
</script>

<style scoped>

</style>
