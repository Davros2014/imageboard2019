(function() {
    Vue.component("image-modal", {
        template: "#image-template", // relates to script with id of
        props: ["imageThatWasClicked"],
        data: function() {
            return {
                imageInfo: [],
                comments: [],
                form: {
                    username: "",
                    comment: "",
                    id: this.imageThatWasClicked
                }
            };
        },
        mounted: function() {
            var self = this; // relates to this in Window
            axios
                .get("/get-image-info/" + this.imageThatWasClicked)
                .then(function(resp) {
                    self.imageInfo = resp.data[0];
                    self.comments = resp.data[1];
                })
                .catch(function(err) {
                    console.log(err.message);
                });
        },
        watch: {
            imageThatWasClicked: function() {
                var self = this;
                axios
                    .get("/get-image-info/" + this.imageThatWasClicked)
                    .then(function(resp) {
                        self.imageId = resp.data[0];
                        self.comments = resp.data[1];
                    });
            }
        },
        methods: {
            uploadComment: function() {
                var self = this;
                var formData = new FormData();
                formData.append("username", this.form.username);
                formData.append("comment", this.form.comment);
                axios
                    .post("/uploadComment", this.form)
                    .then(function(commentResponse) {
                        self.comments.unshift(commentResponse.data);
                        self.form.comment = "";
                        self.form.username = "";
                    })
                    .catch(function(err) {
                        console.log(err.message);
                    });
            },
            closingModal: function() {
                this.$emit("close-modal");
                location.hash = "";
            }
        }
    }); // close Vue component

    new Vue({
        // vue instance
        el: "#main",
        data: {
            conditionInVueInstance: false,
            imageThatWasClicked: location.hash.slice(1),
            name: "",
            images: [],
            showMoreImages: false,
            form: {
                // bind information from html form fields (form here corresponds with form in v-model='form.title')
                title: "",
                description: "",
                username: "",
                file: null
            },
            show: false,
            imageUploading: false
        },
        mounted: function() {
            var self = this;
            axios
                .get("/images" + this.imageThatWasClicked)
                .then(function(response) {
                    self.images = response.data;
                    if (
                        self.images[self.images.length - 1].id !=
                        self.images[self.images.length - 1].lowest_id
                    ) {
                        self.showMoreImages = true;
                    }
                })
                .catch(function(err) {
                    // error (upload)
                    console.log(err.message);
                });

            addEventListener("hashchange", function() {
                self.imageThatWasClicked = location.hash.slice(1);
            });
            // NO ARROW FUNCTIONS!!!!!!
            // NO ES6 !!!!!
        }, // close mounted - comma needed
        //         watch: {
        //             id: function () {
        //                 url = self.images + "#" +
        //             }
        // }
        methods: {
            toggleImageModal: function(image) {
                // this.conditionInVueInstance = true;
                this.imageThatWasClicked = image;
                location.hash = "";
            },
            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            },
            loading: function() {
                var self = this;
                axios
                    .get("/more/" + this.images[this.images.length - 1].id)
                    .then(function(resp) {
                        self.images = self.images.concat(resp.data);
                        if (
                            self.images[self.images.length - 1].id ===
                            // if id of last image in the current load === to lowest_id then stop showing button
                            self.images[self.images.length - 1].lowest_id
                        ) {
                            self.showMoreImages = false;
                        }
                    })
                    .catch(function(err) {
                        // Error uploading image
                        console.log(err.message);
                    });
            },
            uploadFile: function() {
                // UploadFile
                var formData = new FormData();
                // NO ES6
                // const { file, title, username, description } = this.form;
                if (this.form.file) {
                    formData.append("file", this.form.file);
                    formData.append("title", this.form.title);
                    formData.append("username", this.form.username);
                    formData.append("description", this.form.description);
                }
                var self = this; // to distinguish from the global "this"
                axios
                    .post("/upload", formData)
                    .then(function(response) {
                        self.images.unshift({
                            url: response.data.url,
                            title: self.form.title,
                            description: self.form.description,
                            username: self.form.username,
                            id: response.data.id
                        });
                        // clear form data
                        self.form.title = "";
                        self.form.description = "";
                        self.form.username = "";
                        self.form.file = "";
                        // image upload
                    })
                    .catch(function(err) {
                        // Error uploading image
                        console.log(err.message);
                    });
                // end axios
            }
        } // close methods
    }); // Vue instance
})(); // closes iife

// this.form.file - value that is stored in data
// FormData is a globally available API
