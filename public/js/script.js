(function() {
    // this component is the modal that will pop up
    // vue turns the name of the component into a html tag
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
            }; // return end
        }, // function end
        mounted: function() {
            console.log(
                "// this.thingThatWasClicked, ",
                this.imageThatWasClicked
            );
            var self = this; // relates to this in Window
            axios
                .get("/get-image-info/" + this.imageThatWasClicked)
                .then(function(resp) {
                    self.imageInfo = resp.data[0];
                    self.comments = resp.data[1];
                    // console.log("self.imageInfo", self.imageInfo);
                })
                .catch(function(err) {
                    console.log("error", err);
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
                        // console.log("// commentResponse", commentResponse.data);
                        self.comments.unshift(commentResponse.data);
                        // console.log("// self.comments", self.comments);
                    })
                    .catch(function(err) {
                        console.log("error", err);
                    });
            },
            closingModal: function() {
                this.$emit("close-modal");
                // console.log("click click");
                location.hash = "";
            }
        }
    }); // closes Vue component

    new Vue({
        // vue instance
        el: "#main",
        // data is extremely important
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
        }, // closes DATA - comma needed
        mounted: function() {
            var self = this;
            axios
                .get("/images" + this.imageThatWasClicked)
                .then(function(response) {
                    console.log(">>> GET response.data", response.data);
                    self.images = response.data;
                    if (
                        self.images[self.images.length - 1].id !=
                        self.images[self.images.length - 1].lowest_id
                    ) {
                        self.showMoreImages = true;
                    }
                    console.log("// GET Images - self.images", self.images);
                })
                .catch(function(err) {
                    console.log("error (upload)", err.message);
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
                // console.log("toggleImageModal running");
                // console.log(
                //     "this.conditionInVueInstance",
                //     this.conditionInVueInstance
                // );
                console.log("// Images:", image);
                // this.conditionInVueInstance = true;
                this.imageThatWasClicked = image;
                location.hash = "";
                console.log("// This in the vue instance", this);
            }, // always use a comma

            // every single function that runs in response to an event will be written here
            handleFileChange: function(e) {
                // console.log("handleFileChange e", e.target.files[0]); // from object data in inspector
                this.form.file = e.target.files[0];
                console.log("Info of image to upload", this.form.file);
            },
            loading: function() {
                var self = this;
                axios
                    .get("/more/" + this.images[this.images.length - 1].id)
                    .then(function(resp) {
                        // console.log("resp.data", resp.data);
                        // concatenates the response for new images onto the existing array of images
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
                        console.log("Error uploading image", err.message);
                    });
            },
            uploadFile: function() {
                console.log("// UploadFile");
                var formData = new FormData();
                const { file, title, username, description } = this.form;
                formData.append("file", file);
                formData.append("title", title);
                formData.append("username", username);
                formData.append("description", description);
                // console.log("formData: ", formData); formData will return an empty object {} >> this is ok
                var self = this; // to distinguish from the global "this"
                axios
                    .post("/upload", formData)
                    .then(function(response) {
                        // console.log(">>> resp in upload", response.data);
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
                        // console.log("Successful image upload!!");
                    })
                    .catch(function(err) {
                        console.log("Error uploading image", err.message);
                    });
                // end axios
            }
        } // close methods
    }); // Vue instance
})(); // closes iife

// this.form.file - value that is stored in data
// FormData is a globally available API
