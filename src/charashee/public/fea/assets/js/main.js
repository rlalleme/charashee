$(function() {
  var gauge2 = Gauge(
    document.getElementById("gauge2"),
    {
      min: 0,
      max: 3,
      dialStartAngle: 180,
      dialEndAngle: 0,
      value: 0,
      viewBox: "0 0 100 57",
      color: function(value) {
        if(value == 3) {
          return "#dc3545";
        }else if(value == 2) {
          return "#ffc107";
        }else {
          return "#28a745";
        }
      }
    }
  );

  // Stress Jauge
  var startStress = ($("input[name='stress']:checked").val() ? $("input[name='stress']:checked").val(): 0)
  gauge2.setValueAnimated(startStress, 0.6);
  $("input[name='stress']").change(function () {
    gauge2.setValueAnimated($(this).val(), 0.6);
  })
});
