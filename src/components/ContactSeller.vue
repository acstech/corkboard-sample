<template>
  <transition name="modal">
    <post-modal>
      <div class="modal-header">
        <router-link class="close" to="/">&times;</router-link>
      </div>

      <div class="modal-body">
        UGH
      </div>

      <div class="modal-footer">

      </div>
    </post-modal>
  </transition>
</template>

<script>

import PostModal from './PostModal.vue'
export default {
  components: {
    postModal: PostModal
  }
}
</script>

<style scoped>

</style>
