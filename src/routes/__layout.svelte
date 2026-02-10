<svelte:head>
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/flatly/bootstrap.min.css"> -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/yeti/bootstrap.min.css">
</svelte:head>

<script>
    import { Navbar, NavLink, NavbarBrand } from 'sveltestrap';
</script>

<Navbar color="light" light expand="md">
    <NavbarBrand href="/">BioMOBS topological analyses</NavbarBrand>
    <!-- <NavLink href="/api/feature_datapoints.json">Features</NavLink> -->
    <!-- <NavLink href="/">Home</NavLink> -->
    <!-- <NavLink href="/scatter">Scatter</NavLink> -->
    <NavLink href="/stad">STAD</NavLink>
    <!-- <NavLink href="/about">About</NavLink> -->
    <NavbarBrand href="http://vda-lab.io"><img alt="logo" height="30px" src="vda-lab_logo_large.png" /></NavbarBrand>
</Navbar>

<slot></slot>
