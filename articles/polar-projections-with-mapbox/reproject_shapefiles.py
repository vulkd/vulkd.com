import os
import glob


DRY_RUN = True

prefix = "polar"
target_projection_real = "EPSG:3031"
target_projection_faux = "EPSG:3857"

dir_path = os.path.dirname(os.path.realpath(__file__))

for f in os.listdir():
	if os.path.isfile(f):
		continue

	shapefile = glob.glob("{}/{}/*.shp".format(dir_path, f))
	if not shapefile:
		continue

	shapefile_path = shapefile[0]
	new_folder_name = "{}_{}".format(prefix, f)
	tmp_shapefile_name = "tmp_{}".format(shapefile_path.split("/")[-1])
	new_shapefile_name = "{}_{}".format(prefix, shapefile_path.split("/")[-1])
	new_shapefile_path = "{}/{}".format(new_folder_name, new_shapefile_name)

	# Create shapefile directory
	cmd = "mkdir '{}'".format(os.path.join(dir_path, new_folder_name))
	if DRY_RUN:
		print(cmd)
	else:
		os.system(cmd)

	# Transform projection of shapefile
	cmd = "ogr2ogr -t_srs {} '{}' '{}'".format(
		target_projection_real,
		os.path.join(dir_path, tmp_shapefile_name),
		os.path.join(dir_path, shapefile_path))
	if DRY_RUN:
		print(cmd)
	else:
		os.system(cmd)

	# Re-assign (not transform) projection of shapefile
	cmd = "ogr2ogr -a_srs {} '{}' '{}'".format(
		target_projection_faux,
		os.path.join(dir_path, new_shapefile_path),
		os.path.join(dir_path, tmp_shapefile_name))
	if DRY_RUN:
		print(cmd)
	else:
		os.system(cmd)

	# Zip shapefile directory for Mapbox
	cmd = "zip -r '{}.zip' '{}'".format(
		os.path.join(dir_path, new_folder_name),
		os.path.join(dir_path, new_folder_name))
	if DRY_RUN:
		print(cmd)
	else:
		os.system(cmd)

	# Delete shapefile directory
	cmd = "rm -r '{}'".format(os.path.join(dir_path, new_folder_name))
	if DRY_RUN:
		print(cmd)
	else:
		os.system(cmd)

	# Delete tmp files
	tmp_files = glob.glob("{}/tmp_*".format(dir_path))
	for f in tmp_files:
		cmd = "rm '{}'".format(f)
		if DRY_RUN:
			print(cmd)
		else:
			os.system(cmd)

