<template>
    
</template>
<script>
    
export default {
  created() {
    if (this.$route.name && this.$route.name.startsWith('/redirect/')) {
      const path = this.$route.path.substring(9)
      this.$router.replace({ path: path, params: this.$route.params, query: this.$route.query })
    } else {
      this.$router.replace({ path: '/' + this.$route.params.path, params: this.$route.params, query: this.$route.query })
    }
  },
  render: function(h) {
    return h() // avoid warning messageN
  }
}
</script>
<style>
    
</style>