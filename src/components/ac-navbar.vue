<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="row m-0 w-100">
      
      <ul class="navbar-nav mr-auto col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <li class="nav-item active">
          <a class="btn btn-primary small px-4 mr-3" href="#" @click.prevent="$emit('settings-open')">Settings</a>
        </li>
      </ul>
      
      <ul class="navbar-nav justify-content-end ml-auto col-xl-6 col-lg-6 col-md-6 col-sm-12 pr-0">
        <li class="nav-item">
          <a class="nav-link" href="#">Preview</a>
        </li>
        <li class="nav-item ml-3">
          <a class="btn btn-success small px-4" href="#" @click.prevent="$emit('save')">Save</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
