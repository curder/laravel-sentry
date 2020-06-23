<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Example Component</div>

                    <div class="card-body">
                        <button v-on:click="throwError">break app</button>

                        <button @click="customError">custom errors</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        console.log('Component mounted.')
    },
    methods: {
        throwError(event) {
            throw new Error("test" + event);
        },

        customError() {
           this.Sentry.captureMessage("Hey Boy.")
        }
    },
}
</script>
